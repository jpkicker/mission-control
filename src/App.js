import React from 'react';
import { tasks, activity } from './data/tasks';

const projectColors = {
  'Shaw': '#3b82f6',
  'Wolves': '#f97316', 
  'Personal': '#8b5cf6',
  'Bitcoin': '#f59e0b',
  'Clawdbot': '#10b981',
  'General': '#6b7280'
};

const TaskCard = ({ task }) => (
  <div style={{
    background: 'rgba(30, 30, 45, 0.8)',
    borderRadius: '8px',
    padding: '14px',
    marginBottom: '10px',
    border: '1px solid rgba(255,255,255,0.08)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
      <span style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: projectColors[task.project] || '#6b7280',
        marginTop: '6px',
        flexShrink: 0
      }} />
      <span style={{ fontWeight: '600', fontSize: '14px', color: '#fff' }}>{task.title}</span>
    </div>
    {task.description && (
      <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '10px', marginLeft: '16px' }}>
        {task.description}
      </p>
    )}
    <div style={{ display: 'flex', gap: '8px', marginLeft: '16px', flexWrap: 'wrap' }}>
      <span style={{
        fontSize: '10px',
        padding: '3px 8px',
        borderRadius: '4px',
        background: projectColors[task.project] || '#6b7280',
        color: '#fff',
        fontWeight: '500'
      }}>
        {task.project}
      </span>
      {task.date && (
        <span style={{
          fontSize: '10px',
          padding: '3px 8px',
          borderRadius: '4px',
          background: 'rgba(255,255,255,0.1)',
          color: '#9ca3af'
        }}>
          {task.date}
        </span>
      )}
    </div>
  </div>
);

const Column = ({ title, tasks, color }) => (
  <div style={{ flex: 1, minWidth: '250px', maxWidth: '300px' }}>
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px', 
      marginBottom: '16px',
      paddingBottom: '12px',
      borderBottom: '2px solid ' + color
    }}>
      <span style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: color
      }} />
      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{title}</h3>
      <span style={{
        fontSize: '12px',
        color: '#6b7280',
        marginLeft: 'auto'
      }}>{tasks.length}</span>
    </div>
    <div style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>
      {tasks.length === 0 ? (
        <p style={{ fontSize: '13px', color: '#4b5563', textAlign: 'center', padding: '20px' }}>
          No tasks
        </p>
      ) : (
        tasks.map(task => <TaskCard key={task.id} task={task} />)
      )}
    </div>
  </div>
);

const ActivityItem = ({ item }) => (
  <div style={{ 
    display: 'flex', 
    gap: '10px', 
    padding: '10px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)'
  }}>
    <span style={{
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: item.type === 'completed' ? '#10b981' : 
                  item.type === 'started' ? '#3b82f6' : 
                  item.type === 'created' ? '#8b5cf6' : '#6b7280',
      marginTop: '6px',
      flexShrink: 0
    }} />
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: '13px', color: '#e0e0e0' }}>
        <span style={{ color: '#60a5fa', fontWeight: '500' }}>Milo</span>
        {' '}{item.action}{' '}
        <span style={{ color: '#fff', fontWeight: '500' }}>{item.task}</span>
      </p>
      <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>{item.time}</p>
    </div>
  </div>
);

const App = () => {
  const wishlist = tasks.filter(t => t.status === 'wishlist');
  const inProgress = tasks.filter(t => t.status === 'in-progress');
  const review = tasks.filter(t => t.status === 'review');
  const done = tasks.filter(t => t.status === 'done');
  
  const completedThisWeek = done.filter(t => t.completedThisWeek).length;
  const completionRate = tasks.length > 0 ? Math.round((done.length / tasks.length) * 100) : 0;

  return (
    <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🐕</span>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>Mission Control</h1>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>Milo & Jason</span>
        </div>
        <div style={{ display: 'flex', gap: '32px' }}>
          <div>
            <span style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>{completedThisWeek}</span>
            <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>This Week</span>
          </div>
          <div>
            <span style={{ fontSize: '28px', fontWeight: '700', color: '#3b82f6' }}>{inProgress.length}</span>
            <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>In Progress</span>
          </div>
          <div>
            <span style={{ fontSize: '28px', fontWeight: '700', color: '#fff' }}>{tasks.length}</span>
            <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>Total</span>
          </div>
          <div>
            <span style={{ fontSize: '28px', fontWeight: '700', color: '#8b5cf6' }}>{completionRate}%</span>
            <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>Completion</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Kanban Board */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          gap: '16px',
          overflowX: 'auto',
          paddingBottom: '16px'
        }}>
          <Column title="Wishlist" tasks={wishlist} color="#f59e0b" />
          <Column title="In Progress" tasks={inProgress} color="#3b82f6" />
          <Column title="Review" tasks={review} color="#8b5cf6" />
          <Column title="Done" tasks={done} color="#10b981" />
        </div>

        {/* Activity Feed */}
        <div style={{ 
          width: '320px',
          flexShrink: 0,
          background: 'rgba(20, 20, 30, 0.6)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(255,255,255,0.08)',
          maxHeight: 'calc(100vh - 160px)',
          overflowY: 'auto'
        }}>
          <h3 style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#fff',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            ACTIVITY
          </h3>
          {activity.map((item, idx) => (
            <ActivityItem key={idx} item={item} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        marginTop: '24px', 
        paddingTop: '16px', 
        borderTop: '1px solid rgba(255,255,255,0.1)',
        fontSize: '12px',
        color: '#4b5563',
        textAlign: 'center'
      }}>
        Last updated: {new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET
      </div>
    </div>
  );
};

export default App;
