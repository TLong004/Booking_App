import 'package:dio/dio.dart';
import 'package:myapp/core/network/api_client.dart';
import 'package:myapp/models/appointment.dart';

class BookingService {
  final _dio = ApiClient.dio;

  Future<Map<String, dynamic>> createBooking(Map<String, dynamic> data) async {
    try {
      final response = await _dio.post('bookings', data: data);
      return response.data as Map<String, dynamic>;
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? 'Lỗi kết nối máy chủ!');
    }
  }

  Future<List<AppointmentModel>> getBookings() async {
    try {
      final response = await _dio.get('bookings');
      return (response.data as List).map((e) => AppointmentModel.fromJson(e)).toList();
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? 'Lỗi kết nối máy chủ!');
    }
  }

  Future<void> cancelBooking(int id, String cancelReason) async {
    try {
      await _dio.patch('bookings/$id/cancel', data: {'cancelReason': cancelReason});
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? 'Lỗi kết nối máy chủ!');
    }
  }
}