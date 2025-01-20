.PHONY: init
init:
	# Copy environment files
	cp apps/api/.dev.vars.example apps/api/.dev.vars
	cp apps/web/.env.example apps/web/.env.local
	
	# Run build-cf-types from root
	pnpm build-cf-types
	
	# Move to api directory and run commands
	cd apps/api && pnpm prisma:generate && pnpm build
	
	@echo "Initialization completed successfully!"
	@echo "Please check the copied environment files and modify if needed:"
	@echo "  - apps/api/.dev.vars"
	@echo "  - apps/web/.env.local"