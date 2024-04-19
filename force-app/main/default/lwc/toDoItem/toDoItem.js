import { LightningElement, api } from 'lwc';

export default class ToDoItem extends LightningElement {
    @api todoId;
    @api todoName;
    @api done = false;

}