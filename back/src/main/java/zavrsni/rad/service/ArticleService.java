package zavrsni.rad.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import zavrsni.rad.entity.Article;
import zavrsni.rad.entity.Order;
import zavrsni.rad.repository.ArticleRepository;
import zavrsni.rad.repository.OrderRepository;
import zavrsni.rad.request.ArticleCreateRequest;
import zavrsni.rad.request.OrderArticle;
import zavrsni.rad.request.OrderArticleRequests;
import zavrsni.rad.response.OrderArticleResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private OrderRepository orderRepository;

    public List<Article> getAllArticle() {
        return articleRepository.findAll();
    }

    public Article addArticle(ArticleCreateRequest articleCreateRequest) {
        Article a = Article.builder()
                .name(articleCreateRequest.getName())
                .price(articleCreateRequest.getPrice())
                .amount(articleCreateRequest.getAmount())
                .supplier(articleCreateRequest.getSupplier())
                .DemandVariability(articleCreateRequest.getDemandVariability())  // Dodano
                .MonthlyDemand(articleCreateRequest.getMonthlyDemand())          // Dodano
                .LeadTime(articleCreateRequest.getLeadTime())                    // Dodano
                .build();
        return articleRepository.save(a);
    }

    public Article addArticleCount(Long articleId, Long additionalAmount) {
        Optional<Article> articleOptional = articleRepository.findById(articleId);
        if (articleOptional.isPresent()) {
            Article article = articleOptional.get();
            article.setAmount(article.getAmount() + additionalAmount); // Dodavanje količine
            return articleRepository.save(article);
        } else {
            throw new RuntimeException("Article not found");
        }
    }



    public OrderArticleResponse orderArticle(OrderArticleRequests orderArticleRequests) {
        List<Article> articlesToOrder = new ArrayList<>();
        List<OrderArticle> orderedArticles = new ArrayList<>();
        long sum = 0L;
        for (OrderArticle orderArticle : orderArticleRequests.getArticleList()) {
            Optional<Article> articleOptional = articleRepository.findById(orderArticle.getArticleId());
            if (articleOptional.isPresent()) {
                Article a = articleOptional.get();
                a.setAmount(a.getAmount() - orderArticle.getAmount());
                sum += orderArticle.getAmount() * a.getPrice();
                orderedArticles.add(OrderArticle.builder().articleId(a.getId()).amount(orderArticle.getAmount()).name(a.getName()).build());
                articlesToOrder.add(a);
            }
        }

        for (Article article : articlesToOrder) {
            if (article.getAmount() < 0) {
                return OrderArticleResponse.builder()
                        .success(false)
                        .error("Nedovoljno artikala: " + article.getName())
                        .build();
            }
        }

        for(Article article:articlesToOrder){
            for (OrderArticle orderArticle : orderedArticles) {
                if(orderArticle.getArticleId().equals(article.getId())){
                    orderRepository.save(Order.builder().article(article).amount(orderArticle.getAmount()).build());
                }
            }
        }

        articleRepository.saveAll(articlesToOrder);
        return OrderArticleResponse.builder().success(true).sum(sum).articleList(orderedArticles).build();
    }

    public List<String> checkReorderForAllArticles() {
        List<Article> articles = articleRepository.findAll();
        List<String> articlesToReorder = new ArrayList<>();

        for (Article article : articles) {
            String result = ReorderChecker.checkReorder(
                    article.getName(),
                    article.getMonthlyDemand(),
                    article.getAmount().intValue(),
                    article.getDemandVariability(),
                    article.getLeadTime()
            );

            if (result != null) {
                // Dobijanje imena artikla, reorder levela i trenutne količine iz odgovora
                String[] responseParts = result.replaceAll("[{}\"]", "").split(",");
                boolean needsReorder = false;
                double reorderLevel = 0.0;

                for (String part : responseParts) {
                    String[] keyValue = part.split(":");
                    if (keyValue[0].trim().equals("reorder")) {
                        needsReorder = keyValue[1].trim().equals("true");
                    } else if (keyValue[0].trim().equals("reorder_level")) {
                        reorderLevel = Double.parseDouble(keyValue[1].trim());
                    }
                }

                if (needsReorder) {
                    // Adding the article's current amount to the description
                    articlesToReorder.add(String.format("%s - Preporučena količina proizvoda: %.2f - Trenutna Količina: %d",
                            article.getName(), reorderLevel, article.getAmount().intValue()));
                }
            }
        }

        System.out.println(articlesToReorder);
        return articlesToReorder;
    }
}

