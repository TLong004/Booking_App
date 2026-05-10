import 'package:equatable/equatable.dart';
import 'package:hydrated_bloc/hydrated_bloc.dart';
import 'package:meta/meta.dart';
import 'package:myapp/core/network/api_client.dart';
import 'package:myapp/models/user.dart';
import 'package:myapp/repositories/user_reponsitory.dart';
import 'package:firebase_auth/firebase_auth.dart';

part 'auth_event.dart';
part 'auth_state.dart';

class AuthBloc extends HydratedBloc<AuthEvent, AuthState> {
  final AuthReponsitory _authReponsitory = AuthReponsitory();
  AuthBloc() : super(AuthInitial()) {
    on<LoginRequested>((event, emit) async {
      emit(AuthLoading());
      try {
        final user = await _authReponsitory.getUser(event.email, event.password);
        ApiClient.setToken(user.token);
        emit(AuthSuccess(user));
      } on FirebaseAuthException catch (e) {
        emit(AuthFailure(_getFirebaseErrorMessage(e)));
      } catch (e) {
        emit(AuthFailure(e.toString().replaceAll('Exception: ', '')));
      }
    });
    on<RegisterRequested>((event, emit) async {
      emit(AuthLoading());
      try {
        await _authReponsitory.registerUser(event.fullName, event.email, event.password, event.phone);
        emit(RegisterSuccess());
      } on FirebaseAuthException catch (e) {
        emit(AuthFailure(_getFirebaseErrorMessage(e)));
      } catch (e) {
        emit(AuthFailure(e.toString().replaceAll('Exception: ', '')));
      }
    });
    on<ForgotPasswordRequested>((event, emit) async {
      emit(AuthLoading());
      try {
        await _authReponsitory.resetPassword(event.email);
        emit(ForgotPasswordSuccess());
      } on FirebaseAuthException catch (e) {
        emit(AuthFailure(_getFirebaseErrorMessage(e)));
      } catch (e) {
        emit(AuthFailure(e.toString().replaceAll('Exception: ', '')));
      }
    });
    on<LogoutRequested>((event, emit) async {
      emit(AuthLoading());
      try {
        await _authReponsitory.signOut();
        ApiClient.setToken(null);
        emit(AuthInitial());
      } catch (e) {
        emit(AuthFailure(e.toString().replaceAll('Exception: ', '')));
      }
    });
  }

  String _getFirebaseErrorMessage(FirebaseAuthException e) {
    switch (e.code) {
      case 'user-not-found':
        return 'Không tìm thấy tài khoản với email này.';
      case 'wrong-password':
        return 'Mật khẩu không hợp lệ.';
      case 'invalid-email':
        return 'Định dạng email không hợp lệ.';
      case 'user-disabled':
        return 'Tài khoản này đã bị khóa.';
      case 'email-already-in-use':
        return 'Email này đã được đăng ký.';
      case 'invalid-credential':
        return 'Tên đăng nhập hoặc mật khẩu không chính xác.';
      default:
        return e.message ?? 'Lỗi xác thực: ${e.code}';
    }
  }

  @override
  AuthState? fromJson(Map<String, dynamic> json) {
    final user = UserModel.fromJson(json);
    ApiClient.setToken(user.token);
    return AuthSuccess(user);
  }

  @override
  Map<String, dynamic>? toJson(AuthState state) {
    if (state is AuthSuccess) {
      return state.user.toJson();
    }
    return null;
  } 
}
