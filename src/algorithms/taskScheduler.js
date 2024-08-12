function scheduleTasks(tasks) {
  const sortedTasks = tasks.sort((a, b) => a.priority - b.priority);
  const schedule = {};

  for (const task of sortedTasks) {
      const startDate = new Date(task.startDate);
      const endDate = new Date(task.dueDate);
      const estimatedDays = Math.ceil(task.estimatedCompletionHours / task.dailyLimit);

      let currentDate = new Date(startDate);

      for (let day = 0; day < estimatedDays; day++) {
          if (currentDate > endDate) {
              break;
          }

          const remainingHours = Math.min(task.dailyLimit, task.estimatedCompletionHours);
          if (!schedule[currentDate]) {
              schedule[currentDate] = [];
          }
          schedule[currentDate].push({ taskName: task.name, hours: remainingHours });

          currentDate.setDate(currentDate.getDate() + 1);
      }
  }

  return schedule;
}

// Example tasks with daily limits
const tasks = [
  { name: 'Task 1', startDate: '2024-02-25', dueDate: '2024-02-28', estimatedCompletionHours: 20, dailyLimit: 8, priority: 1 },
  { name: 'Task 2', startDate: '2024-02-25', dueDate: '2024-02-28', estimatedCompletionHours: 16, dailyLimit: 6, priority: 2 },
  { name: 'Task 3', startDate: '2024-02-27', dueDate: '2024-03-01', estimatedCompletionHours: 12, dailyLimit: 4, priority: 3 }
];

// Schedule tasks
const result = scheduleTasks(tasks);
console.log(result);


useEffect(()=>{
  const fetchEvents = async () => {
   try {
      // Check if user is defined before getting token
      if (!user) {
       return; // Exit early if user is not defined
      }

      const token = await user.getIdToken();
      console.log("token is", token);
      const response = await axios.get(`/api/schedule`,{
        headers: {authtoken: token},
      }); 
      // Check if response status is successful 
      if (response.status >= 200 && response.status < 300) {
        const data = response.data;
        console.log("The data is: ,",data);

        //Format data to FullCalendar-compatible format
        // const formattedEvents = [];
        // for(const dateKey in data){
        //   if(Object.prototype.hasOwnProperty.call(data, dateKey)){
        //     const events= data[dateKey];
        //     if (Array.isArray(events)) {
        //     events.forEach(event => {
        //       formattedEvents.push({
        //         title: event.taskName,
        //         start: new Date(dateKey),
        //       });
        //     });
        //   }
        // }
        // }

        const formattedEvents = [];
        data.forEach(dateObject => {
          for (const dateKey in dateObject) {
            if (Object.prototype.hasOwnProperty.call(dateObject, dateKey)) {
              const events = dateObject[dateKey];
              events.forEach(event => {
                formattedEvents.push({
                  title: event.taskName,
                  start: new Date(dateKey),
                });
              });
            }
          }
        });

    
       // Format fetched events to FullCalendar-compatible format
       //const formattedEvents = data.map(event => ({
        //title: event.title,
        //start: event.startDate , 
        //end: event.dueDate,
        // You can add more properties like 'end' if needed
      //}));
      console.log("formatted data:", formattedEvents);
      setCalendarEvents(formattedEvents);
    } else {
      throw new Error('Failed to fetch events');
    } 
  }
    catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  fetchEvents();
}, [user]); // Run only once when component mounts