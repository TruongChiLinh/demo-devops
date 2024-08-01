# Sử dụng hình ảnh node chính thức để xây dựng ứng dụng
FROM node:18 AS build

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json vào thư mục làm việc //
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào thư mục làm việc
COPY . .

# Xây dựng ứng dụng React
RUN npm run build

# Sử dụng hình ảnh nginx chính thức để phục vụ ứng dụng
FROM nginx:alpine

# Sao chép các tệp build vào thư mục nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Khởi động nginx
CMD ["nginx", "-g", "daemon off;"]
