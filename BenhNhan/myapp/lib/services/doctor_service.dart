import 'package:dio/dio.dart';
import 'package:myapp/core/network/api_client.dart';
import 'package:myapp/models/doctor.dart';
import 'package:myapp/models/work_schedule.dart';

class DoctorService {
  final _dio = ApiClient.dio;

  Future<List<dynamic>> getDoctorBySpecialty(int id) async {
    try {
      final response = await _dio.get('doctors/specialty/$id');
      return response.data as List<dynamic>;
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? 'Lỗi kết nối máy chủ!');
    }
  }

  Future<List<dynamic>> getAllDoctors() async {
    try {
      final response = await _dio.get('doctors');
      return response.data as List<dynamic>;
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? 'Lỗi kết nối máy chủ!');
    }
  }

  Future<List<dynamic>> getDoctorByService(int id) async {
    try {
      final response = await _dio.get('doctors/service/$id');
      print(response.data);
      return response.data as List<dynamic>;  
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? 'Lỗi kết nối máy chủ!');
    }
  }

  Future<List<dynamic>> searchDoctors(String query)  async {
    try {
     final response = await _dio.get('doctors/search?query=$query');
     return response.data as List<dynamic>;
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? 'Lỗi kết nối máy chủ!');
    }
  }

  Future<List<dynamic>> filterRating(double rating)  async {
    try {
     final response = await _dio.get('doctors/filter?minRating=$rating');
     return response.data as List<dynamic>;
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? 'Lỗi kết nối máy chủ!');
    }
  }

  Future<dynamic> getDoctorDetail(int id) async {
    try {
      final response = await _dio.get('doctors/$id');
      return response.data;
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? 'Lỗi kết nối máy chủ!');
    }
  }

  Future<List<String>> getAvailableDates(int doctorId, String from, String to) async {
    final response = await _dio.get("doctors/$doctorId/available-dates", queryParameters: {
      "from": from,
      "to": to,
    });
    return List<String>.from(response.data);
  }

  Future<List<WorkScheduleModel>> getAvailableSlots(int doctorId, String date) async {
    final response = await _dio.get("doctors/$doctorId/available-slots", queryParameters: {
      "date": date,
    });
    return (response.data as List).map((e) => WorkScheduleModel.fromJson(e)).toList();
  }

  Future<List<DoctorModel>> getTopDoctors() async {
    try {
      final response = await _dio.get('doctors/top-rated');
      return (response.data as List).map((e) => DoctorModel.fromJson(e)).toList();
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? 'Lỗi kết nối máy chủ!');
    }
  }
}