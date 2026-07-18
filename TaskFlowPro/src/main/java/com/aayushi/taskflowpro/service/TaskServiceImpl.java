package com.aayushi.taskflowpro.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aayushi.taskflowpro.entity.Task;
import com.aayushi.taskflowpro.enums.Category;
import com.aayushi.taskflowpro.enums.Priority;
import com.aayushi.taskflowpro.enums.Status;
import com.aayushi.taskflowpro.repository.TaskRepository;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Override
    public Task createTask(Task task) {

        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());

        return taskRepository.save(task);
    }

    @Override
    public List<Task> getAllTasks() {

        return taskRepository.findAll();
    }

    @Override
    public Task getTaskById(String id) {

        return taskRepository.findById(id).orElse(null);
    }

    @Override
    public Task updateTask(String id, Task task) {

        Task existingTask = taskRepository.findById(id).orElse(null);

        if (existingTask == null) {
            return null;
        }

        existingTask.setTitle(task.getTitle());
        existingTask.setDescription(task.getDescription());
        existingTask.setPriority(task.getPriority());
        existingTask.setStatus(task.getStatus());
        existingTask.setCategory(task.getCategory());
        existingTask.setDueDate(task.getDueDate());

        // Preserve original creation time
        existingTask.setCreatedAt(existingTask.getCreatedAt());

        // Update modified time
        existingTask.setUpdatedAt(LocalDateTime.now());

        return taskRepository.save(existingTask);
    }

    @Override
    public void deleteTask(String id) {

        taskRepository.deleteById(id);
    }

    @Override
    public List<Task> getTasksByStatus(Status status) {

        return taskRepository.findByStatus(status);
    }

    @Override
    public List<Task> getTasksByPriority(Priority priority) {

        return taskRepository.findByPriority(priority);
    }

    @Override
    public List<Task> getTasksByCategory(Category category) {

        return taskRepository.findByCategory(category);
    }

    @Override
    public List<Task> searchByTitle(String title) {

        return taskRepository.findByTitleContainingIgnoreCase(title);
    }

}