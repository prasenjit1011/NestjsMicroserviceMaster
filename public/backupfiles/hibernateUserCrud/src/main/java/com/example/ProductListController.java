package com.example;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductListController {
    @Autowired
    private ProductListRepository repo;

    @GetMapping
    public List<ProductList> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public ProductList create(@RequestBody ProductList product) {
        return repo.save(product);
    }
}
