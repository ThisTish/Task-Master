// ? use as removing a project from the array
const cities = ["Manchester", "Liverpool", "Edinburgh", "Carlisle"];
const index = cities.indexOf("Liverpool");
if (index !== -1) {
  cities.splice(index, 1);
}
console.log(cities); 
// ? will also have to remove from local storage

// ? to use to move parts of the arrays into different columns/colorcoded?
function isLong(city) {
	return city.length > 8;
  }
  const towns = ["London", "Liverpool", "Totnes", "Edinburgh"];
  const longer = towns.filter(isLong);
  console.log(longer);



  // Todo: create a function to generate a unique task id
  function getUniqueId(){
    let uniqueId = self.crypto.randomUUID();
  }



  // Todo: create a function to create a task card
function createTaskCard(project){
  const taskCard =
}



  // Todo: create a function to render the task list and make cards draggable




  // Todo: create a function to handle adding a new task




  // Todo: create a function to handle deleting a task




  // Todo: create a function to handle dropping a task into a new status lane




  // Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
