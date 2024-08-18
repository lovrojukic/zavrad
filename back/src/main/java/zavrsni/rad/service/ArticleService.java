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
                .MonthlyDemand(articleCreateRequest.getMonthlyDemand())
                .LeadTime(articleCreateRequest.getLeadTime())
                .build();
        return articleRepository.save(a);
    }

    public Article addArticleCount(Long articleId, Long additionalAmount) {
        Optional<Article> articleOptional = articleRepository.findById(articleId);
        if (articleOptional.isPresent()) {
            Article article = articleOptional.get();
            article.setAmount(article.getAmount() + additionalAmount);
            return articleRepository.save(article);
        } else {
            throw new RuntimeException("Article not found");
        }
    }





    public List<String> checkReorderForAllArticles() {
        List<Article> articles = articleRepository.findAll();
        List<String> articlesToReorder = new ArrayList<>();

        for (Article article : articles) {
            String result = ReorderChecker.checkReorder(
                    article.getName(),
                    article.getMonthlyDemand(),
                    article.getAmount().intValue(),
                    article.getLeadTime()
            );

            if (result != null) {
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

                    articlesToReorder.add(String.format("%s - Preporučena količina proizvoda: %.2f - Trenutna Količina: %d",
                            article.getName(), reorderLevel, article.getAmount().intValue()));
                }
            }
        }

        System.out.println(articlesToReorder);
        return articlesToReorder;
    }
}

