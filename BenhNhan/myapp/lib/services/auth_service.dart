import 'package:myapp/core/network/api_client.dart';
import 'package:dio/dio.dart';

class AuthService { 
  final _dio = ApiClient.dio;

  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await _dio.post('auth/login', data: {'username': email, 'password': password});
      return response.data as Map<String, dynamic>;
    } on DioException catch (e) {
      if (e.response?.statusCode == 401) {
        throw Exception('Sai tên đăng nhập hoặc mật khẩu!');
      }
      throw Exception(e.response?.data?['message'] ?? 'Lỗi kết nối máy chủ!');
    }
  }

  Future<Map<String, dynamic>> register(String fullName, String email, String password, String phone) async {
    try {
      final response = await _dio.post('auth/register', data: {
        'fullName': fullName,
        'email': email,
        'username': email, 
        'password': password,
        'phone': phone,
      });
      return response.data as Map<String, dynamic>;
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? 'Đăng ký thất bại!');
    }
  }

  Future<Map<String, dynamic>> authWithFirebase(String token, {String? fullName, String? phone}) async {
    try {
      final response = await _dio.post('auth/firebase', data: {
        'token': token,
        'fullName': fullName,
        'phone': phone,
      });
      return response.data as Map<String, dynamic>;
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? 'Xác thực với máy chủ thất bại!');
    }
  }

  Future<Map<String, dynamic>> logout() async {
    try {
      final response = await _dio.post('auth/logout');
      return response.data as Map<String, dynamic>;
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? 'Lỗi kết nối máy chủ!');
    }
  }
}