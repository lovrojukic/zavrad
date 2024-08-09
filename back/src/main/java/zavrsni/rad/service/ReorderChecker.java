package zavrsni.rad.service;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Scanner;

public class ReorderChecker {
    public static String checkReorder(String product, Long monthlyDemand, int currentStock, double demandVariability, Long leadTime) {
        try {
            URL url = new URL("http://localhost:5001/check_reorder");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json; utf-8");
            conn.setRequestProperty("Accept", "application/json");
            conn.setDoOutput(true);

            String jsonInputString = String.format(Locale.US,
                    "{\"product\": \"%s\", \"monthly_demand\": %d, \"current_stock\": %d, \"demand_variability\": %.6f, \"lead_time\": %d}",
                    product, monthlyDemand, currentStock, demandVariability, leadTime);

            System.out.println("Sending JSON: " + jsonInputString);

            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonInputString.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            try (Scanner scanner = new Scanner(conn.getInputStream(), StandardCharsets.UTF_8.name())) {
                String jsonResponse = scanner.useDelimiter("\\A").next();
                System.out.println(jsonResponse);
                System.out.println("Response from Flask: " + jsonResponse);
                return jsonResponse;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
