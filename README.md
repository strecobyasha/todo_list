# TODO List

### Core ideas

* Django for backend logic and templates, React for frontend logic;
* Sockets for transfer data from frontend to the database;
* Users are stored in PostgreSQL;
* TODO items are stored in MongoDB (one user - one block of storage).

### Functionality

Add new TODO items;

Create and edit content inside each item (double click to start editing);

Remove TODO items (that ugly button with crest inside);

Make items done or undone (by default) by using slider;

Undo last actions one by one;

Save the list of items.

### How to start?

```bash 
make build
```

When starts project for the first time after building it: 
```bash 
make migrate
```

```bash 
make collect_static
```

### What to do next?

* Tests;
* Logging and telemetry (opentelemetry+Jaegger);
* CI/CD.
