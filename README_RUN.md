Frontend quick run

1) cd notes_frontend
2) echo "REACT_APP_API_BASE=http://localhost:5001/api" > .env.development
3) npm install
4) npm start

Requires the backend running at:
PORT=5001 DB_PATH=./myapp.db python3 ../../simple-notes-app-182240-182249/notes_database/api_server.py
