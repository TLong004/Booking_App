import 'package:dio/dio.dart';
import 'package:myapp/core/network/api_client.dart';
import 'package:myapp/models/patient.dart';

class PatientService {
  final _dio = ApiClient.dio;

  Future<List<PatientModel>> getPatients() async {
    try {
      final response = await _dio.get('patients');
      return (response.data as List).map((e) => PatientModel.fromJson(e)).toList();
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? 'Lỗi kết nối máy chủ!');
    }
  }

  Future<PatientModel> createPatient(Map<String, dynamic> data) async {
    try {
      final response = await _dio.post('patients', data: data);
      return PatientModel.fromJson(response.data);
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? 'Lỗi kết nối máy chủ!');
    }
  }

  Future<PatientModel> updatePatient(int id, Map<String, dynamic> data) async {
    try {
      final response = await _dio.put('patients/$id', data: data);
      return PatientModel.fromJson(response.data);
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? 'Lỗi kết nối máy chủ!');
    }
  }

  Future<void> deletePatient(int id) async {
    try {
      await _dio.delete('patients/$id');
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? 'Lỗi kết nối máy chủ!');
    }
  }
}