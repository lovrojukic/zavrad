package zavrsni.rad.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import zavrsni.rad.entity.Article;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
}
