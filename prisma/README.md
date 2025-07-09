# Prisma Python Integration

## Setup Instructions

1. **Install Prisma CLI and Python Client**

   ```sh
   npm install -g prisma
   pip install prisma
   ```

2. **Run Prisma Migrate and Generate Python Client**

   ```sh
   prisma migrate dev --name init
   prisma generate --generator python
   ```

3. **Usage in Python**

   See `main.py` for how to use the generated Prisma client.

## Model

See `schema.prisma` for the `Result` model definition.
