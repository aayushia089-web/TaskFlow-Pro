package com.aayushi.taskflowpro.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.aayushi.taskflowpro.entity.Task;
import com.aayushi.taskflowpro.enums.Category;
import com.aayushi.taskflowpro.enums.Priority;
import com.aayushi.taskflowpro.enums.Status;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {

    List<Task> findByStatus(Status status);

    List<Task> findByPriority(Priority priority);

    List<Task> findByCategory(Category category);

    List<Task> findByTitleContainingIgnoreCase(String title);

    @Query("{'$or':[{'title':{$regex:?0,$options:'i'}},{'description':{$regex:?0,$options:'i'}}]}")
    List<Task> searchTasks(String keyword);

}