# Image Asset Organization

This folder contains all static images for the Kona Island Coffee website.

## Folder Structure

```
/public/images/
├── team/        # Team member headshots
├── truck/       # Coffee truck photos
├── store/       # Store location photos
└── menu/        # Menu item photography
```

## Image Specifications

### Team Photos (`/team/`)
- **Format**: JPG or PNG
- **Size**: 800x800px (square, 1:1 ratio)
- **Naming**: Use lowercase first name (e.g., `kalani.jpg`, `mia.jpg`)
- **Usage**: Referenced in `src/content/team.json`

### Truck Photos (`/truck/`)
- **Format**: JPG
- **Size**: 1600x1200px (landscape, 4:3 ratio)
- **Naming**: Descriptive names (e.g., `truck-hero.jpg`, `truck-service.jpg`)
- **Usage**: Referenced in About page

### Store Photos (`/store/`)
- **Format**: JPG
- **Size**: 1920x1080px (landscape, 16:9 ratio)
- **Naming**: Descriptive names (e.g., `opening-hero.jpg`, `san-jose-exterior.jpg`)
- **Usage**: Referenced in About page and Locations page

### Menu Photos (`/menu/`)
- **Format**: JPG
- **Size**: 800x600px (landscape, 4:3 ratio)
- **Naming**: Match menu item slugs (e.g., `kona-espresso.jpg`, `lilikoi-crepe.jpg`)
- **Usage**: Referenced in Menu Preview page

## Uploading Images

### Via GitHub Web Interface
1. Navigate to `public/images/[folder]/` on GitHub
2. Click "Add file" → "Upload files"
3. Drag and drop your images
4. Commit with message: `chore: add [description] images`

### Via Git Command Line
```bash
# Copy images to correct folder
cp ~/my-images/team-photo.jpg public/images/team/

# Stage and commit
git add public/images/
git commit -m "chore: add team photos"
git push
```

## Image Optimization

Before uploading, optimize images for web:
- Use JPG for photos (better compression)
- Use PNG for graphics with transparency
- Keep file sizes under 500KB when possible
- Use descriptive alt text in code

## Placeholder Behavior

If an image is missing, Next.js Image component will show:
- A gray placeholder background (`bg-kona-taupe/20`)
- The component will not break or error

Update the referenced image path in JSON files when adding new images.
