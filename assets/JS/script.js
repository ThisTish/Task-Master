// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));

// *went with the random id generator function for id
// let nextId = JSON.parse(localStorage.getItem("nextId"));
// comment to update to deploy
let formModal = $('#formModal')
const taskCardEl = $('taskCard')
const taskTitleEl = $('.titleInput')
const taskDescriptionEl = $('.descriptionInput')
const taskDueDateEl = $('.dueDate')
const saveTaskEl = $('.saveBtn')
const addTaskBtnEl = $('.addTaskBtn')
const deleteBtnEl = $('.deleteBtn')

function readLocalTasks(){
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
}

// Todo: create a function to create a task card
function createTaskCard(task) {
	const taskCard = $('<div>')
	.addClass('card task-card draggable my-3')
	.attr('data-task-id', task.id)
	
	const cardTitle = $('<div>').addClass('card-header h4').text(task.name)
	const cardBody = $('<div>').addClass('card-body')
	const cardDescription = $('<p>').addClass('card-text').text(task.description)
	const formatDueDate = dayjs(task.dueDate).format('MM/DD/YYYY')
	const cardDueDate = $('<p>').addClass('card-text').text(formatDueDate)
	
	const deleteBtn = $('<button>')
	.addClass('btn btn-danger delete')
	.text('Delete')
	.attr('data-task-id', task.id)
	
	deleteBtn.on('click', handleDeleteTask)
	
	if(task.dueDate && task.status !== 'done'){
		const now = dayjs()
		const soon = 2
		const taskDueBy = dayjs(task.dueDate, 'DD/MM/YYYY')

		const daysTilDue = taskDueBy.diff(now,'day')
		
		if(daysTilDue <= soon && daysTilDue >= 0){
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

	$(".draggable").draggable({
		zIndex: 100,
		opacity: .5,
		helper: function(e){
			const card = $(e.target).hasClass('.ui-draggable')
			? $(e.target)
			: $(e.target).closest('.ui-draggable')
			return card.clone().css({
				width: card.outerWidth()
			})
		}
	})
	
	
	
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
	
	console.log(tasks)
	$('#modalForm').modal('hide')
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(){
	const taskId = $(this).attr('data-task-id')
	let tasks = readLocalTasks()
	tasks = tasks.filter((task) => task.id !== taskId)
	
	saveLocalTasks(tasks)
	
renderTaskList()
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
	
	const taskId = ui.draggable[0].dataset.taskId
	
	const newStatus = event.target.id
	let tasks = readLocalTasks()
	
	for(let task of tasks){
		if(task.id === taskId){
			task.status = newStatus
		}
	}
	console.log(tasks)
	saveLocalTasks(tasks)
	renderTaskList()
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
	renderTaskList()
	
	$('.taskDueDate').datepicker({
		changeMonth: true,
		changeYear: true
	})
	

	$('.lane').droppable({
		accept:'.draggable',
		drop: handleDrop
	})
	
	$('#formModal').on('submit', handleAddTask)
	deleteBtnEl.on('click', handleDeleteTask)
	
	
} )