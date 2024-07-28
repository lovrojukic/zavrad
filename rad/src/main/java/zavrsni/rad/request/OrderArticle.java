package zavrsni.rad.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderArticle {
    private Long articleId;
    private Long amount;
    private String name;
}
