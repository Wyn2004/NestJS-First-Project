Cài đặt nestJs

1. Cài vài thư viện tips như
2. Nest JS sửa dụng chủ yếu mô hình 3 lớp
   Controller -> Service -> Repository

Controller: Response data to client
Service: Handle Logic
Repository: Handle logic related data

# Lưu ý

Trong nestJs, muốn đưa services và repositoy quản lý thì ta phải nhét 2 hàm đó vào DI ( Dependency Injection)
B1: Đánh dấu Decorator cho service
B2: Đưa service vào modules

Dùng constructor để Inject Service cho Controller

B3: Đánh dấu Decorator cho Controller
B2: Đưa Controller vào modules

--- Modules ---
Được đánh dấu bằng @Module
Giúp tổ chức code hiệu quả
Mỗi Project chưa ít nhất 1 Module
-> Cách tạo 1 module
npx nest g module <fileName>

--- Tích hợp Database ---
Tải những thư viện sau về
npm install --save @nestjs/typeorm typeorm mysql2
Lên trang chủ copy paste code này về và chỉnh sửa

#

TypeOrmModule.forRoot({
type: 'mysql',
host: 'localhost',
port: 3308,
username: 'root',
password: '12345',
database: 'store-nestjs',
entities: [],
synchronize: true,
}),

Muốn tạo entity thì tạo như trên docs rồi nhét vào entity trong phần config trên

TypeOrmModule.forFeature([User])
import orm module vào file module của entity
