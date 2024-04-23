import { LightningElement, track } from 'lwc';
import addTodo from "@salesforce/apex/ToDoController.addTodo";
import getCurrentTodos from "@salesforce/apex/ToDoController.getCurrentTodos";

export default class ToDoManager extends LightningElement {
    @track time = "8:15 PM";
    @track greeting = "Good Evening";

    @track todos = [];

    connectedCallback() {
        this.getTime();
        //this.populateTodos();
        this.fetchTodos();

        setInterval(() => {
            this.getTime();
            console.log("set interval called");
        }, 1000 * 60); // Cada minuto
    }

    getTime() {
        const date = new Date();
        const hour = date.getHours();
        const min = date.getMinutes();
        
        this.time = `${this.getHour(hour)}:${this.getDoubleDigit(min)} ${this.getMidDay(hour)}`;
        this.setGreeting(hour);
    }

    getHour(hour) {
        return hour === 0 ? 12 : hour > 12 ? (hour - 12) : hour;
    }

    getMidDay(hour) {
        return hour >= 12 ? "PM" : "AM";
    }

    getDoubleDigit(digit) {
        return digit < 10 ? "0" + digit :  digit;
    }

    setGreeting(hour) {
        if(hour < 12) {
            this.greeting = "Good Morging";
        } else if(hour >= 12 && hour < 17) {
            this.greeting = "Good Afternoon";
        } else {
            this.greeting = "Good Evening";
        }
    }

    addTodoHandler() {
        const inputBox = this.template.querySelector("lightning-input");

        const todo = {
            todoName: inputBox.value,
            done: false
        }

        addTodo({payload: JSON.stringify(todo)})
        .then(response => {
            console.log("Iten inserted successfully");
            this.fetchTodos();
        }).catch(error => {
            console.log("Error in inserting todo item " + error);
        });

        //this.todos.push(todo);
        inputBox.value = "";
    }

    fetchTodos() {
        getCurrentTodos()
        .then(result => {
            if(result) {
                console.log("Retrieved todos from server ", result.length);
                this.todos = result;
            }
        })
        .catch(error => {
            console.log("Error in fetching todos " + error);
        });
    }

    /**
     * Obtenga una lista nueva de todos una vez que se actualice todo
     * Este método se llama en el evento update
     * @param {*} event
     */
    updateTodoHandler(event) {
        if(event) {
            this.fetchTodos();
        }
    }

    /**
     * Obtenga una nueva lista de todos una vez que se elimine todo
     * This method is called on delete event Este método se llama en el evento delete
     * @param {*} event
     */
    deleteTodoHandler(event) {
        if(event) {
            this.fetchTodos();
        }
    }

    get upcomingTasks(){
        return this.todos && this.todos.length ? this.todos.filter( todo => !todo.done) : [];
    }

    get completedTasks(){
        return this.todos && this.todos.length ? this.todos.filter( todo => todo.done) : [];
    }

    /* populateTodos() {
        const todos = [
            {
                todoId: 0,
                todoName: "Feed the dog",
                done:false,
                todoDate: new Date()
            },
            {
                todoId: 1,
                todoName: "Wash the car",
                done:false,
                todoDate: new Date()
            },
            {
                todoId: 2,
                todoName: "Send email to manager",
                done:true,
                todoDate: new Date()
            },
        ];

        this.todos = todos;
    } */
}