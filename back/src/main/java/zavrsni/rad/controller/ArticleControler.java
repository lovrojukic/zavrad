package zavrsni.rad.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import zavrsni.rad.entity.Article;
import zavrsni.rad.request.ArticleCreateRequest;
import zavrsni.rad.request.ArticleUpdateRequest;
import zavrsni.rad.request.OrderArticle;
import zavrsni.rad.request.OrderArticleRequests;
import zavrsni.rad.response.OrderArticleResponse;
import zavrsni.rad.service.ArticleService;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/article")
public class ArticleControler {

    @Autowired
    private ArticleService articleService;

    @GetMapping
    public List<Article> getAllArticles(){
        return articleService.getAllArticle();
    }

    @PostMapping
    public Article addArticle(@RequestBody ArticleCreateRequest article){
        return articleService.addArticle(article);
    }

    @PostMapping("order")
    public OrderArticleResponse orderArticle(@RequestBody OrderArticleRequests orderArticleRequests){
        return articleService.orderArticle(orderArticleRequests);
    }

    @PostMapping("/addcount")
    public ResponseEntity<?> addArticleCounts(@RequestBody List<ArticleUpdateRequest> updateRequests) {
        try {
            List<Article> updatedArticles = new ArrayList<>();
            for (ArticleUpdateRequest updateRequest : updateRequests) {
                Article updatedArticle = articleService.addArticleCount(updateRequest.getArticleId(), updateRequest.getAdditionalAmount());
                updatedArticles.add(updatedArticle);
            }
            return ResponseEntity.ok(updatedArticles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error processing request");
        }
    }

}
