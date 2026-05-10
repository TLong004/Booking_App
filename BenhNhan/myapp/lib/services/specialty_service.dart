import 'package:dio/dio.dart';
import 'package:myapp/core/network/api_client.dart';

class SpecialtyService {
  final _dio = ApiClient.dio;

  Future<List<dynamic>> getAllspecialties() async {
    try {
      final response = await _dio.get('specialties');
      return response.data as List<dynamic>;
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? 'Lỗi kết nối máy chủ!');
    }
  }

  
}