## How to Build and Deploy
We deploy our app both **locally** and in our **cloud VPS**.

### Local Deployment (Development)

First, clone the repo:
```bash
git clone https://github.com/natecarman/CS130-Budget/
```

#### Setup the backend
Next, create a Python virtual environment for the Django backend and install all the dependencies with
```bash
cd budgeter
python3 -m venv venv
source venv/bin/activate
pip install -r ../requirements.txt
```

Now apply all migrations to the database (this only needs to be done once):
```bash
python manage.py migrate
```

Finally, get the backend running with
```bash
python manage.py runserver
```
You should now be able to see the backend by going to [http://127.0.0.1:8000/](http://127.0.0.1:8000/) in your browser. (It should complain about an index missing error, ignore this.)

#### Setup the frontend
The React frontend setup is easier. First, (in a different terminal window, leave the backend running) install the dependencies with
```bash
cd frontend
npm install
```

Then just run the frontend React development server with
```bash
npm start
```

And your done! Go get yourself a treat, you deserve it ;)

### Remote Deployment (eg. Cloud VPS)

For remote deployment, the process is mostly the same, but there are some extra steps.

First, you will need to build the React frontend into a static directory:
```bash
npm run build
```
(Instead of using the React development server, the Django backend will now be responsible for serving the frontend files.)

Additionally, you will need to add the domain of the VPS to the list of allowed hosts in the Django settings.py file:
```python3
ALLOWED_HOSTS = ['www.clevercash.pro', '127.0.0.1', 'localhost']
```

That's it! There is almost surely additional configuration (Firewall, DNS, HTTPS, etc.) needed that is specific to your cloud provider. Good luck with that! Seriously good luck.

## Documentation
You can find the full documentation [here](https://natecarman.github.io/CS130-Budget/).
