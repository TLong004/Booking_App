import 'package:dio/dio.dart';
import 'package:myapp/core/network/api_client.dart';

class ServiceService {
  final _dio = ApiClient.dio;

  Future<List<dynamic>> getServicesBySpecialty(int id) async {
    try {
      final response = await _dio.get('specialties/$id/services');
      return response.data as List<dynamic>;
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? 'Lỗi kết nối máy chủ!');
    }
  }

  Future<List<dynamic>> getServicesByDoctor(int id) async {
    try {
      final response = await _dio.get('doctors/$id/services');
      return response.data as List<dynamic>;
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? 'Lỗi kết nối máy chủ!');
    }
  }
}