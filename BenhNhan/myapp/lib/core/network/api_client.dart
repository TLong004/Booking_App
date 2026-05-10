import 'package:dio/dio.dart';

class ApiClient {
  static String? _token;

  static final Dio dio = Dio(
    BaseOptions(
      baseUrl: 'http://192.168.0.233:8080/api/',
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {'Content-Type': 'application/json'},
    ),
  );

  static void setToken(String? token) {
    _token = token;
  }

  static void setupInterceptors() {
    dio.interceptors.clear();
    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        if (_token != null && _token!.isNotEmpty) {
          options.headers['Authorization'] = 'Bearer $_token';
        } else {
          print('[API] CẢNH BÁO: Không có token – ${options.method} ${options.path}');
        }
        return handler.next(options);
      },
      onError: (error, handler) {
        print('[API] LỖI ${error.response?.statusCode}: ${error.requestOptions.method} ${error.requestOptions.path}');
        print('[API] Response body: ${error.response?.data}');
        return handler.next(error);
      },
    ));
  }
}