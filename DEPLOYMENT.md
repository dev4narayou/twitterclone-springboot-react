# Deployment Guide: Updating on EC2

When you push new code to GitHub, it doesn't automatically appear on your EC2 server. You need to pull the changes and restart your containers.

## The Process

1.  **SSH into your EC2 instance**
    ```bash
    ssh -i "your-key.pem" ubuntu@your-ec2-ip
    ```

2.  **Navigate to your project directory**
    ```bash
    cd twitterclone-springboot-react
    ```

3.  **Pull the latest changes from GitHub**
    ```bash
    git pull origin main
    ```
    *Note: If you have local changes on the server that conflict, you might need to stash them (`git stash`) or reset (`git reset --hard origin/main`).*

4.  **Rebuild and Restart Containers**
    This command rebuilds the images with your new code and restarts the services.
    ```bash
    docker-compose up -d --build
    ```
    - `-d`: Detached mode (runs in background).
    - `--build`: Forces a rebuild of the images (crucial for code changes).

5.  **Verify it's running**
    ```bash
    docker-compose ps
    ```

## FAQ

### Will I lose my database data?
**No.** As long as you haven't deleted the `postgres_data` volume (check your `docker-compose.yml`), your users and posts will be preserved even if you rebuild the containers.

### Do I need to stop the containers first?
Not necessarily. `docker-compose up -d --build` is smart enough to recreate only what's changed and swap them out. However, there might be a few seconds of downtime.

### What if I added a new environment variable?
If you added a new variable to your local `.env` file, you **must** manually add it to the `.env` file on your EC2 server before running the build command.

## Troubleshooting

### "fatal: Need to specify how to reconcile divergent branches"
This means you have local changes on your EC2 server that conflict with GitHub. To force your server to match GitHub exactly (discarding local changes), run:
```bash
git fetch origin
git reset --hard origin/main
```
**Warning**: This deletes any code changes you made directly on the server.
