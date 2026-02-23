package com.mycompany.gunyuxing;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

public class BackendServer {
    private ProfileManager manager;

    public BackendServer() {
        manager = new ProfileManager();
    }

    public void start() throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/profile", new ProfileHandler());
        server.setExecutor(null); // Default executor
        server.start();
        System.out.println("Backend server started on http://localhost:8080");
    }

    class ProfileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            String method = exchange.getRequestMethod();

            if ("GET".equals(method)) {
                String response = manager.getProfileJson();
                sendResponse(exchange, 200, response);
            } else if ("POST".equals(method)) {
                // Read body
                InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8);
                StringBuilder body = new StringBuilder();
                char[] buffer = new char[1024];
                int len;
                while ((len = isr.read(buffer)) != -1) {
                    body.append(buffer, 0, len);
                }
                isr.close();

                manager.updateFromJson(body.toString());
                sendResponse(exchange, 200, "{\"status\":\"updated\"}");
            } else {
                sendResponse(exchange, 405, "Method Not Allowed");
            }
        }
    }

    private void addCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
    }

    private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        exchange.sendResponseHeaders(statusCode, response.getBytes().length);
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }

    public static void main(String[] args) throws IOException {
        new BackendServer().start();
    }
}