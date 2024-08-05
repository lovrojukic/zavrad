package zavrsni.rad.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArticleCreateRequest {
    private String name;
    private Long amount;
    private double price;
    private String supplier;
}
