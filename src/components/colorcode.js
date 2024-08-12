const fetchEvents = async () => {
    try {
        if (!user) {
            return;
        }

        const token = await user.getIdToken();
        const response = await axios.get('/api/schedule', {
            headers: { authtoken: token },
        });

        if (response.status === 200) {
            const data = response.data;
            console.log("data", data);

            const formattedEvents = [];

            Object.entries(data[0]).forEach(([dateString, tasks]) => {
                const date = new Date(dateString);
                tasks.forEach(task => {
                    let priorityClass = '';
                    if (task.priority === 'low') {
                        priorityClass = 'low-priority';
                    } else if (task.priority === 'medium') {
                        priorityClass = 'medium-priority';
                    } else if (task.priority === 'high') {
                        priorityClass = 'high-priority';
                    }

                    formattedEvents.push({
                        title: `${task.taskName} - ${task.hours} hr`,
                        start: date,
                        end: date, // Assuming same as start for simplicity
                        className: priorityClass, // Assign priority class
                    });
                });
            });

            console.log("formatted data:", formattedEvents);
            setCalendarEvents(formattedEvents);
        } else {
            setCalendarEvents([]);
            console.log("No schedule data found for the user");
        }
    } catch (error) {
        console.error('Error fetching events:', error);
    }
};

// .low-priority {
//     background-color: green;
// }

// .medium-priority {
//     background-color: orange;
// }

// .high-priority {
//     background-color: red;
// }
