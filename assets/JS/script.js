// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

function readLocalTasks(tasks){
	let tasks = localStorage.getItem('tasks',JSON.parse(tasks))
	if(!tasks){
		return tasks=[]
	}
	return tasks
}

function saveLocalTasks(tasks){
	localStorage.setItem('tasks',JSON.stringify(tasks))
}

// Todo: create a function to generate a unique task id
function generateTaskId() {
	return self.crypto.randomUUID();
}//*found on mdn

// Todo: create a function to create a task card
function createTaskCard(task) {
	const taskCard = $('<div>').addClass('card task-card draggable my-3').attr('data-task-id', task.id)
	
	const cardTitle = $('<div>').addClass('card-header h4').text(task.name)
	const cardBody = $('<div>').addClass('body')
	const cardDescription = $('<p>').addClass('card-text').text(task.taskDescription)
	const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate)
	
	const deleteBtn = $('<button>').addClass('btn btn-danger delete').text('Delete').attr('data-task-id', task.id)
	deleteBtn.on('click', handleDeleteTask)
	
	if(task.dueDate && task.status !== 'done'){
		const now = dayjs()
		const soon = 3
		const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY')
		
		if(now.isSame(taskDueDate,'day') || now.isBefore(taskDueDate.subtract(soon),'day')){
			taskCard.addClass('bg-warning text-white')
		}
		else if(now.isAfter(taskDueDate)){
			taskCard.addClass('bg-danger text-white')
			deleteBtn.addClass('border-warning')
		}	
	}
	cardBody.append(cardDescription, cardDueDate, deleteBtn)
	taskCard.append(cardTitle, cardBody)

	return taskCard
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
	const tasks = readLocalTasks()

	const todoList = $('#todo-cards');
	todoList.empty();
	const inProgressList = $('#in-progress-cards');
	inProgressList.empty();
	const doneList = $('#done-cards');
	doneList.empty();

	for (let task of tasks){
		if(task.status === 'to-do'){
			todoList.append(createTaskCard(task))
		}
		else if(task.status === 'in-progress'){
			inProgressList.append(createTaskCard(task))
		}
		else if(task.status === 'done'){
			doneList.append(createTaskCard(task))
		}
	}

	// *found on jqueryui
	$(function() {
		$(".draggable").draggable({
			zIndex: 100,
			opacity: .5,
			helper: function(e){
				const card = $(e.target).hasClass('ui-draggable')
				?$(e.target)
				: $(e.target).closest('ui-draggable')
				return card.clone().css({
					width: card.outerWidth()
				})
			}
		})
	} )
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {




	// *dueDate datePicker:  
	// $( function() {
    // $( "#datepicker" ).datepicker();
} );

});
