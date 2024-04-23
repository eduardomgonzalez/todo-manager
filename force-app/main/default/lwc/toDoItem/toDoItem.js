/**
 * ToDoItem component
 * Proporciona la posibilidad de editar/eliminar el item.
 */

import { LightningElement, api } from 'lwc';
import updateTodo from "@salesforce/apex/ToDoController.updateTodo";
import deleteTodo from "@salesforce/apex/ToDoController.deleteTodo";

export default class ToDoItem extends LightningElement {
    // Propiedades públicas
    @api todoId;
    @api todoName;
    @api done = false;

    /**
     * Actualizar controlador para editar el elemento actual
     * Puede cambiar el estado del item entre completado e incompleto
     * Realizar una llamada al servidor para actualizar el artículo.
     */
    updateHandler() {
        // Crear un objeto todo basado en el elemento actual
        const todo = {
          todoId: this.todoId,
          done: !this.done,
          todoName: this.todoName
        };
    
        // Hacer una llamada al servidor para actualizar el elemento
        updateTodo({ payload: JSON.stringify(todo) })
          .then(result => {
            // En caso de actualización exitosa, active un evento para notificar al componente principal
            const updateEvent = new CustomEvent("update", { detail: todo });
            this.dispatchEvent(updateEvent);
          })
          .catch(error => {
            console.error("Error in updatig records ", error);
          });
      }

    /**
     * Para eliminar el elemento actual
     * Realizar una llamada al servidor para eliminar el elemento.
     */
    deleteHandler() {
        // Hacer una llamada al servidor para eliminar el elemento
        deleteTodo({ todoId: this.todoId })
          .then(result => {
            // En caso de eliminación exitosa, active un evento para notificar al componente principal
            this.dispatchEvent(new CustomEvent("delete", { detail: this.todoId }));
          })
          .catch(error => {
            console.error("Error in updatig records ", error);
          });
      }

    get containerClass() {
        return this.done ? "todo completed" : "todo upcoming";
    }
    
    get iconName() {
        return this.done ? "utility:check" : "utility:add";
    }

    // Propiedad get para devolver el nombre del icono según el estado del elemento
    // Para el item completado, devuelve el ícono de verificación; de lo contrario, devuelve el ícono de agregar
    get buttonIcon() {
        return this.done ? "utility:check" : "utility:add";
    }

    // Propiedad get para devolver la clase de contenedor
    get containerClass() {
        return this.done ? "todo completed" : "todo upcoming";
    }
}