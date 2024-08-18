package zavrsni.rad.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import zavrsni.rad.request.OrderArticle;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class OrderArticleResponse {
    private boolean success;
    private String error;
    private List<OrderArticle> articleList;
    private Long totalPrice;  // Ovdje bi bilo dobro preimenovati u `totalPrice` i promijeniti tip u `BigDecimal`
}

