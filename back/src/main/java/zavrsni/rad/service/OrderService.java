package zavrsni.rad.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import zavrsni.rad.entity.Article;
import zavrsni.rad.entity.Order;
import zavrsni.rad.entity.OrderItem;
import zavrsni.rad.repository.ArticleRepository;
import zavrsni.rad.repository.OrderItemRepository;
import zavrsni.rad.repository.OrderRepository;
import zavrsni.rad.request.OrderArticle;
import zavrsni.rad.request.OrderArticleRequests;
import zavrsni.rad.response.OrderArticleResponse;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    public List<Order> getAllOrder() {
        return orderRepository.findAll();
    }

    public OrderArticleResponse orderArticle(OrderArticleRequests orderArticleRequests) {
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (OrderArticle orderArticle : orderArticleRequests.getArticleList()) {
            Optional<Article> articleOptional = articleRepository.findById(orderArticle.getArticleId());
            if (articleOptional.isPresent()) {
                Article article = articleOptional.get();
                Long amount = orderArticle.getAmount();
                BigDecimal price = BigDecimal.valueOf(article.getPrice()).multiply(BigDecimal.valueOf(amount));



                // Ažuriranje količine artikla
                article.setAmount(article.getAmount() - amount);

                OrderItem orderItem = OrderItem.builder()
                        .article(article)
                        .amount(amount)
                        .build();

                orderItems.add(orderItem);
                totalPrice = totalPrice.add(price);
            }
        }

        // Kreiranje i pohrana narudžbe
        Order order = Order.builder()
                .orderItems(orderItems)
                .totalPrice(totalPrice)
                .build();

        // Povezivanje orderItems s orderom
        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }

        orderRepository.save(order);
        orderItemRepository.saveAll(orderItems);
        articleRepository.saveAll(orderItems.stream().map(OrderItem::getArticle).toList()); // Ažuriranje artikala u bazi

        return OrderArticleResponse.builder()
                .success(true)
                .totalPrice(totalPrice.longValue())
                .articleList(orderArticleRequests.getArticleList())
                .build();
    }


}
