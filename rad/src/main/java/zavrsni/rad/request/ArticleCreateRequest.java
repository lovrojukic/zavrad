package zavrsni.rad.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArticleCreateRequest {
    private String name;
    private Long amount;
    private Long price;
    private String supplier;
}
