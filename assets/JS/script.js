// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
let formModal = $('#formModal')
const taskCardEl = $('taskCard')
const taskTitleEl = $('.titleInput')
const taskDescriptionEl = $('.descriptionInput')
const taskDueDateEl = $('.dueDate')
const saveTaskEl = $('.saveBtn')
const addTaskBtnEl = $('.addTaskBtn')
const deleteBtnEl = $('.deleteBtn')

// console.log(JSON.parse(localStorage.tasks))

// ?do i need tasks as a paramater
function readLocalTasks(){
	let tasks = JSON.parse(localStorage.getItem('tasks'))
	if(!tasks){
		return tasks=[]
	}
	return tasks
}
// console.log(JSON.parse(localStorage.tasks))

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
	.attr('data-task-id', task.id)
	
	deleteBtn.on('click', handleDeleteTask)
	
	if(task.dueDate && task.status !== 'done'){
		const now = dayjs()
		const soon = 2
		const taskDueBy = dayjs(task.dueDate, 'DD/MM/YYYY')
		// ? isBefore might need to be isAfter, or change subtract to add

		const daysTilDue = taskDueBy.diff(now,'day')

		if(now.isAfter(taskDueBy)){
			taskCard.addClass('bg-danger text-white')
			deleteBtn.addClass('border-warning')
		}
		else if(daysTilDue <= soon || daysTilDue === 0){
			taskCard.addClass('bg-warning text-white')
		}
	}
	cardBody.append(cardDescription, cardDueDate, deleteBtn)
	taskCard.append(cardTitle, cardBody)
	return taskCard
}
// console.log(JSON.parse(localStorage.tasks))

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
	// ?might not need the first function part or add taskCardEl
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

// console.log(JSON.parse(localStorage.tasks))

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
	
	$('#modalForm').modal('hide')
}
// console.log(JSON.parse(localStorage.tasks))
// Todo: create a function to handle deleting a task
function handleDeleteTask(){
	const taskId = $(this).attr('data-task-id')
	let tasks = readLocalTasks()
	tasks = tasks.filter((task) => task.id !== taskId)
	
	saveLocalTasks(tasks)
	
renderTaskList()
}
// console.log(JSON.parse(localStorage.tasks))
// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
	// * starts on line 170, also need to work on understanding
	
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
	
	// ?move these outside this function?
	$('#formModal').on('submit', handleAddTask)
	// $('#formModal').submit(function(e){
	// 	// preventDefault()
	// 	handleAddTask()
	// 	$('#formModal').modal('toggle')
	// })
	deleteBtnEl.on('click', handleDeleteTask)
	
	
} )