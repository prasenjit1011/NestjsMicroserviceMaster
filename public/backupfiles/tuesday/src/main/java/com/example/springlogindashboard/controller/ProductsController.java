package com.example.springlogindashboard.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.*;

@Controller
public class ProductsController {

    @GetMapping("/products")
    public String products(Model model) {
        List<Map<String, Object>> products = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            Map<String, Object> p = new HashMap<>();
            p.put("id", i);
            p.put("name", "Product " + i);
            p.put("description", "This is a custom description for Product " + i + ".");
            p.put("price", "$" + (10 * i));
            p.put("imageUrl", "https://picsum.photos/seed/prod" + i + "/400/180");
            products.add(p);
        }
        model.addAttribute("products", products);
        return "products";
    }

    @GetMapping("/order/confirm")
    public String confirmOrder(@RequestParam("productId") int productId, Model model) {
        model.addAttribute("message", "Order placed for Product " + productId + "!");
        return "products";
    }
}