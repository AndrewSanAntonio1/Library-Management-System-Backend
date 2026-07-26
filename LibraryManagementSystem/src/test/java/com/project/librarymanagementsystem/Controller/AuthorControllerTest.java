package com.project.librarymanagementsystem.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.librarymanagementsystem.DTO.AuthorRequest;
import com.project.librarymanagementsystem.DTO.AuthorResponse;
import com.project.librarymanagementsystem.DTO.MessageResponse;
import com.project.librarymanagementsystem.Service.AuthorService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthorController.class)
class AuthorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthorService authorService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createAuthor_Success() throws Exception {
        AuthorRequest request = new AuthorRequest("Test Author", "Biography", "USA");
        AuthorResponse response = new AuthorResponse(1L, "Test Author", "Biography", "USA", null, null);

        when(authorService.createAuthor(any())).thenReturn(response);

        mockMvc.perform(post("/api/authors")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Test Author"));
    }

    @Test
    void getAllAuthors_Success() throws Exception {
        AuthorResponse response = new AuthorResponse(1L, "Test Author", "Biography", "USA", null, null);

        when(authorService.getAllAuthors()).thenReturn(Arrays.asList(response));

        mockMvc.perform(get("/api/authors"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test Author"));
    }

    @Test
    void getAuthorById_Success() throws Exception {
        AuthorResponse response = new AuthorResponse(1L, "Test Author", "Biography", "USA", null, null);

        when(authorService.getAuthorById(anyLong())).thenReturn(response);

        mockMvc.perform(get("/api/authors/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Author"));
    }

    @Test
    void updateAuthor_Success() throws Exception {
        AuthorRequest request = new AuthorRequest("Updated Author", "New Biography", "UK");
        AuthorResponse response = new AuthorResponse(1L, "Updated Author", "New Biography", "UK", null, null);

        when(authorService.updateAuthor(anyLong(), any())).thenReturn(response);

        mockMvc.perform(put("/api/authors/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Author"));
    }

    @Test
    void deleteAuthor_Success() throws Exception {
        MessageResponse response = new MessageResponse("Author deleted successfully");

        when(authorService.deleteAuthor(anyLong())).thenReturn(response);

        mockMvc.perform(delete("/api/authors/1"))
                .andExpect(status().isNoContent());
    }
}
