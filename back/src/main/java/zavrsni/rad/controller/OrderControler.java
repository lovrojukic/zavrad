package zavrsni.rad.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import zavrsni.rad.entity.Article;
import zavrsni.rad.entity.Order;
import zavrsni.rad.request.ArticleCreateRequest;
import zavrsni.rad.request.ArticleUpdateRequest;
import zavrsni.rad.request.OrderArticle;
import zavrsni.rad.request.OrderArticleRequests;
import zavrsni.rad.response.OrderArticleResponse;
import zavrsni.rad.service.ArticleService;
import zavrsni.rad.service.OrderService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/order")
public class OrderControler {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public List<Order> getAllOrders(){
        return orderService.getAllOrder();
    }

    @PostMapping
    public OrderArticleResponse orderArticle(@RequestBody OrderArticleRequests orderArticleRequests){
        return orderService.orderArticle(orderArticleRequests);
    }
}
