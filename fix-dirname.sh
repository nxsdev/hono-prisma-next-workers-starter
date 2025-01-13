#!/bin/sh

# Prisma Client uses __dirname to resolve the path to the schema.prisma file.ｈ
# https://github.com/prisma/prisma/issues/22827

for PRISMA_LIB in \
    "node_modules/.pnpm/prisma@6.2.1/node_modules/prisma/prisma-client/runtime/library.js" \
    "node_modules/.pnpm/@prisma+client@6.2.1_prisma@6.2.1/node_modules/@prisma/client/runtime/library.js"
do
    if [ -f "$PRISMA_LIB" ]; then
        echo "Modifying $PRISMA_LIB"
        sed -i '1i\globalThis.__dirname = "/";' "$PRISMA_LIB"
        echo "Successfully added __dirname definition to $PRISMA_LIB"
    else
        echo "Warning: File not found at $PRISMA_LIB"
    fi
done