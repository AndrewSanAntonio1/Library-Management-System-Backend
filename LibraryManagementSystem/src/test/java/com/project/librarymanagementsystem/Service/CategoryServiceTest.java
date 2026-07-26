package com.project.librarymanagementsystem.Service;

import com.project.librarymanagementsystem.DTO.CategoryRequest;
import com.project.librarymanagementsystem.DTO.CategoryResponse;
import com.project.librarymanagementsystem.Entity.Category;
import com.project.librarymanagementsystem.Mapper.CategoryMapper;
import com.project.librarymanagementsystem.Repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private CategoryMapper categoryMapper;

    @InjectMocks
    private CategoryService categoryService;

    private Category category;
    private CategoryRequest categoryRequest;
    private CategoryResponse categoryResponse;

    @BeforeEach
    void setUp() {
        category = new Category();
        category.setId(1L);
        category.setName("Fiction");
        category.setDescription("Fiction books");

        categoryRequest = new CategoryRequest("Fiction", "Fiction books");
        categoryResponse = new CategoryResponse(1L, "Fiction", "Fiction books", null, null);
    }

    @Test
    void createCategory_Success() {
        when(categoryRepository.existsByName(anyString())).thenReturn(false);
        when(categoryMapper.toEntity(any())).thenReturn(category);
        when(categoryRepository.save(any())).thenReturn(category);
        when(categoryMapper.toResponse(any())).thenReturn(categoryResponse);

        CategoryResponse response = categoryService.createCategory(categoryRequest);

        assertNotNull(response);
        assertEquals("Fiction", response.name());
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void createCategory_NameExists_ThrowsException() {
        when(categoryRepository.existsByName(anyString())).thenReturn(true);

        assertThrows(RuntimeException.class, () -> categoryService.createCategory(categoryRequest));
        verify(categoryRepository, never()).save(any());
    }

    @Test
    void getCategoryById_Success() {
        when(categoryRepository.findById(anyLong())).thenReturn(Optional.of(category));
        when(categoryMapper.toResponse(any())).thenReturn(categoryResponse);

        CategoryResponse response = categoryService.getCategoryById(1L);

        assertNotNull(response);
        assertEquals("Fiction", response.name());
    }

    @Test
    void updateCategory_Success() {
        when(categoryRepository.findById(anyLong())).thenReturn(Optional.of(category));
        when(categoryRepository.save(any())).thenReturn(category);
        when(categoryMapper.toResponse(any())).thenReturn(categoryResponse);

        CategoryResponse response = categoryService.updateCategory(1L, categoryRequest);

        assertNotNull(response);
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void deleteCategory_Success() {
        when(categoryRepository.findById(anyLong())).thenReturn(Optional.of(category));
        doNothing().when(categoryRepository).delete(any());

        categoryService.deleteCategory(1L);

        verify(categoryRepository, times(1)).delete(any(Category.class));
    }
}
