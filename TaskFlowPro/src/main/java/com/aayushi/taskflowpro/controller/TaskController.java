package com.aayushi.taskflowpro.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.aayushi.taskflowpro.entity.Task;
import com.aayushi.taskflowpro.enums.Category;
import com.aayushi.taskflowpro.enums.Priority;
import com.aayushi.taskflowpro.enums.Status;
import com.aayushi.taskflowpro.service.TaskService;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // ============================
    // CREATE TASK
    // ============================
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskService.createTask(task);
    }

    // ============================
    // GET ALL TASKS
    // ============================
    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    // ============================
    // GET TASK BY ID
    // ============================
    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable String id) {
        return taskService.getTaskById(id);
    }

    // ============================
    // UPDATE TASK
    // ============================
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable String id,
                           @RequestBody Task task) {

        return taskService.updateTask(id, task);
    }

    // ============================
    // DELETE TASK
    // ============================
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable String id) {

        taskService.deleteTask(id);
    }

    // ============================
    // SEARCH TITLE
    // ============================
    @GetMapping("/search")
    public List<Task> searchTasks(
            @RequestParam String title) {

        return taskService.searchByTitle(title);
    }

    // ============================
    // STATUS FILTER
    // ============================
    @GetMapping("/status/{status}")
    public List<Task> getByStatus(
            @PathVariable Status status) {

        return taskService.getTasksByStatus(status);
    }

    // ============================
    // PRIORITY FILTER
    // ============================
    @GetMapping("/priority/{priority}")
    public List<Task> getByPriority(
            @PathVariable Priority priority) {

        return taskService.getTasksByPriority(priority);
    }

    // ============================
    // CATEGORY FILTER
    // ============================
    @GetMapping("/category/{category}")
    public List<Task> getByCategory(
            @PathVariable Category category) {

        return taskService.getTasksByCategory(category);
    }

}