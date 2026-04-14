const TODOIST_TOKEN = process.env.TODOIST_TOKEN;

exports.handler = async () => {
  const res = await fetch('https://api.todoist.com/rest/v2/tasks', {
    headers: {
      Authorization: `Bearer ${TODOIST_TOKEN}`,
    },
  });

  if (!res.ok) {
    return { statusCode: res.status, body: JSON.stringify({ error: 'Todoist error' }) };
  }

  const tasks = await res.json();

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(tasks),
  };
};
