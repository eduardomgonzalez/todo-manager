/**
 * ToDoManager class
 * Soporte para agregar/eliminar/actualizar/recuperar
 */
public class ToDoController {

    // Agregar un nuevo elemento en el objeto ToDo__c
    // Acepta el objeto ToDo serializado
    @AuraEnabled
    public static String addTodo(String payload) {
      ToDo payloadObject = (ToDo) JSON.deserialize(payload, ToDo.class);
  
      SObject todo = (Sobject) Type.forName('ToDo__c').newInstance();
      todo.put('Name', payloadObject.todoName);
      todo.put('Done__c', payloadObject.done);
  
      insert todo;
  
      return String.valueOf(todo.Id);
    }

    // Actualizar un elemento
    // Acepta el objeto ToDo serializado
    @AuraEnabled
    public static void updateTodo(String payload) {
      ToDo payloadObject = (ToDo) JSON.deserialize(payload, ToDo.class);
  
      SObject todo = (Sobject) Type.forName('ToDo__c').newInstance();
      todo.put('Id', payloadObject.todoId);
      todo.put('Name', payloadObject.todoName);
      todo.put('Done__c', payloadObject.done);
  
      update todo;
    }

    //Eliminar un elemento
    //Acepta el ID del elemento a eliminar
    @AuraEnabled
    public static void deleteTodo(String todoId) {
      SObject todo = (Sobject) Type.forName('ToDo__c').newInstance();
      todo.put('Id', todoId);
  
      delete todo;
    }

    // Obtener todos los datos de los últimos 7 días
    // El método es cacheable, lo que significa que la respuesta se almacenará en caché en el navegador
    @AuraEnabled(cacheable=true)
    public static List<ToDo> getAllTodos() {
      List<SObject> todos = Database.query(
        'SELECT Id, Name, CreatedDate, Done__c FROM ToDo__c WHERE CreatedDate = LAST_N_DAYS:7 ORDER BY CreatedDate DESC'
      );
  
      return getToDos(todos);
    }
  
    // Obtén todos los todos por hoy
    @AuraEnabled
    public static List<ToDo> getCurrentTodos() {
      List<SObject> todos = Database.query(
        /* 'SELECT Id, Name, CreatedDate, Done__c FROM ToDo__c WHERE CreatedDate = TODAY ORDER BY CreatedDate DESC' */
        'SELECT Id, Name, CreatedDate, Done__c FROM ToDo__c ORDER BY CreatedDate DESC'
      );
      return getToDos(todos);
    }
  
    // Wrap ToDo__c SObject en un objeto ToDo
    public static List<ToDo> getToDos(List<SObject> objs) {
      List<ToDo> todos = new List<ToDo>();
      
      for (SObject obj : objs) {
        ToDo todo = new ToDo();
        todo.todoId = obj.Id;
        todo.todoName = String.valueOf(obj.get('Name'));
        todo.todoDate = Date.valueOf(obj.get('CreatedDate'));
        todo.done = Boolean.valueOf(obj.get('Done__c'));
        todos.add(todo);
      }
  
      return todos;
    }
  
    // Clase Wrap para representar un item
    public class ToDo {
      @AuraEnabled
      public String todoId;
      @AuraEnabled
      public String todoName;
      @AuraEnabled
      public Date todoDate;
      @AuraEnabled
      public Boolean done;
    }
  }