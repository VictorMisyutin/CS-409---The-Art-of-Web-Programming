import React, { Component } from 'react';

interface ListItemProps {
  task: string;
  onDelete: () => void;
}

const ListItem: React.FC<ListItemProps> = ({ task, onDelete }) => {
  return (
    <div>
      {task} <button onClick={onDelete}>Delete</button>
    </div>
  );
};

interface ListProps {
  tasks: string[];
  onDeleteTask: (taskToDelete: string) => void;
}

const List: React.FC<ListProps> = ({ tasks, onDeleteTask }) => {
  return (
    <>
      {tasks.map((task, index) => (
        <ListItem key={index} task={task} onDelete={() => onDeleteTask(task)} />
      ))}
    </>
  );
};

interface AppState {
  tasks: string[];
  newTask: string;
  isButtonDisabled: boolean;
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      tasks: [],
      newTask: '',
      isButtonDisabled: true,
    };
  }

  handleAddTask = () => {
    const { newTask, tasks } = this.state;
    if (newTask.trim() !== '') {
      this.setState({
        tasks: [...tasks, newTask],
        newTask: '',
        isButtonDisabled: true,
      });
    } else {
      alert('Please add a task');
    }
  };

  handleDeleteTask = (taskToDelete: string) => {
    const { tasks } = this.state;
    this.setState({
      tasks: tasks.filter((task) => task !== taskToDelete),
    });
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTask = e.target.value;
    this.setState({
      newTask,
      isButtonDisabled: newTask.trim() === '',
    });
  };

  render() {
    const { tasks, newTask, isButtonDisabled } = this.state;

    return (
      <div>
        <input
          type="text"
          value={newTask}
          onChange={this.handleInputChange}
          placeholder="Enter a task"
        />
        <button onClick={this.handleAddTask} disabled={isButtonDisabled}>
          Submit
        </button>
        <List tasks={tasks} onDeleteTask={this.handleDeleteTask} />
      </div>
    );
  }
}

export default App;
