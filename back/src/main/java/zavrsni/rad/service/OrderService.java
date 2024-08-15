package zavrsni.rad.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import zavrsni.rad.entity.Article;
import zavrsni.rad.entity.Order;
import zavrsni.rad.repository.ArticleRepository;
import zavrsni.rad.repository.OrderRepository;

import java.util.List;

@Service
public class OrderService {
    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
