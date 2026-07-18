package com.aayushi.taskflowpro.service;

import java.util.List;

import com.aayushi.taskflowpro.entity.Task;
import com.aayushi.taskflowpro.enums.Category;
import com.aayushi.taskflowpro.enums.Priority;
import com.aayushi.taskflowpro.enums.Status;

public interface TaskService {

    Task createTask(Task task);

    List<Task> getAllTasks();

    Task getTaskById(String id);

    Task updateTask(String id, Task task);

    void deleteTask(String id);

    List<Task> getTasksByStatus(Status status);

    List<Task> getTasksByPriority(Priority priority);

    List<Task> getTasksByCategory(Category category);

    List<Task> searchByTitle(String title);

}