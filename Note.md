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

--- Pipes và Validation ---
Pipes:
https://docs.nestjs.com/pipes
dùng để chuyển đổi kiểu dữ liệu từ request thành kiểu dữ liệu đúng trong typescript
-> thường dùng trong service

Validation:
https://docs.nestjs.com/techniques/validation#auto-validation
cài thư viện: npm i --save class-validator class-transformer
config trong main.ts
app.useGlobalPipes(new ValidationPipe());
thường sẽ làm trong DTO

--- Serialization ---
là 1 interceptor
dùng để ẩn hiện những trường ko muốn show ra khi trả về response
dùng @Exclude()s trong entity
dùng @UseInterceptors(ClassSerializerInterceptor)
ở những nơi response về entity vừa exclude thường gắn ở controller

--- Middleware ---
dùng để xử lý yêu cầu trước khi thực hiện controller
https://docs.nestjs.com/middleware
configure(consumer: MiddlewareConsumer) {
consumer
.apply(LoggerMiddleware)
.exclude(
{ path: 'user/login', method: RequestMethod.POST }, // Loại trừ route POST /user/login
{ path: 'admin', method: RequestMethod.GET } // Loại trừ route GET /admin
)
.forRoutes(
{ path: 'user', method: RequestMethod.ALL }, // Áp dụng middleware cho tất cả route bắt đầu với /user
{ path: 'product', method: RequestMethod.GET } // Chỉ áp dụng cho GET /product
);
}

--- Guard ---
https://docs.nestjs.com/guards
dùng để xem xem người dùng có đủ quyền để truy cập ko

--- Cấu hình dotenv ---
https://docs.nestjs.com/techniques/configuration
https://docs.nestjs.com/techniques/database#async-configuration
cài thư viện này: npm i --save @nestjs/config
paste ConfigModule.forRoot() vào app.module

--- JWT, bCrypt NestJS ---
https://docs.nestjs.com/security/authentication#implementing-the-sign-in-endpoint

--- SetMeta và Reflector ---
Trong NestJS, metadata thường được sử dụng để lưu trữ và truyền dữ liệu giữa các thành phần (decorator, middleware, guard, interceptor, v.v.).

Reflector là một lớp trong NestJS được sử dụng để lấy metadata đã được gắn với một đối tượng hoặc phương thức.
Bạn cũng có thể set metadata bằng decorator hoặc API cụ thể.
