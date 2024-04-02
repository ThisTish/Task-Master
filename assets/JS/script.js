// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

const addTaskBtnEl = document.querySelector('.addTaskBtn')
// ? taskCardEl = document.querySelector('taskCard')
// ? modalForm = document.querySelector('modalForm')
const taskTitleEl = document.querySelector('.titleInput')
const taskDescriptionEl = document.querySelector('.descriptionInput')
const taskDueDateEl = document.querySelector('.dueDate')
const saveTaskEl = document.querySelector('.saveBtn')
const deleteBtnEl = document.querySelector('.deleteBtn')

// ?do i need tasks as a paramater
function readLocalTasks(tasks){
	let tasks = JSON.parse(localStorage.getItem('tasks'))
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
	const taskCard = $('<div>')
	.addClass('card task-card draggable my-3')
	.attr('data-task-id', task.id)
	
	const cardTitle = $('<div>').addClass('card-header h4').text(task.name)
	const cardBody = $('<div>').addClass('card-body')
	const cardDescription = $('<p>').addClass('card-text').text(task.description)
	const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate)
	
	const deleteBtn = $('<button>')
	.addClass('btn btn-danger delete')
	.text('Delete')
	// ? why is this here
	.attr('data-task-id', task.id)
	
	deleteBtn.on('click', handleDeleteTask)
	
	if(task.dueDate && task.status !== 'done'){
		const now = dayjs()
		const soon = 3
		const taskDueBy = dayjs(task.dueDate, 'DD/MM/YYYY')
		// ? isBefore might need to be isAfter, or change subtract to add
		if(now.isSame(taskDueBy,'day') || now.isBefore(taskDueBy.subtract(soon),'day')){
			taskCard.addClass('bg-warning text-white')
		}
		else if(now.isAfter(taskDueBy)){
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
	// ?might not need the first function part
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
	event.preventDefault()

	const taskID = generateTaskId()
	const taskName = taskTitleEl.val()
	const taskDescription = taskDescriptionEl.val()
	const taskDueDate = taskDueDateEl.val()

	
	const newTask= {
		id: taskID,
		name: taskName,
		description: taskDescription,
		dueDate: taskDueDate,
		status: 'to-do'
	}
		
	const tasks = readLocalTasks()
	tasks.push(newTask)
	saveLocalTasks(tasks)
	renderTaskList()

	taskTitleEl.val('')
	taskDescriptionEl.val('')
	taskDueDateEl.val('')

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
	const taskId = $(this).attr('data-task-id')
	const tasks = readLocalTasks()
tasks = tasks.filter((task) => task.id !== taskId)

saveLocalTasks(tasks)

renderTaskList()
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
// * starts on line 170, also need to work on understanding
	tasks = readLocalTasks()

	const taskId = ui.draggable[0].dataset.taskId

	const newStatus = event.target.id

	for(let task of tasks){
		if(task.id === taskId){
		task.tatus = newStatus
		}
	}
	saveLocalTasks()
	renderTaskList()
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {


	modalForm.on('submit', handleAddTask)
	taskCardEl.deleteBtn.on('click', handleDeleteTask)



// * starts on 203, need to add an eventlistener for submit button and add task button


	// *dueDate datePicker:  
	// $( function() {
    // $( "#datepicker" ).datepicker();
} );

