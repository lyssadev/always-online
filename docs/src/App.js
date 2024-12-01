import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Container,
  Input,
  Button,
  Select,
  Text,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Link,
  IconButton,
  Flex,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash, FaSun, FaMoon, FaSmile } from 'react-icons/fa';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

function App() {
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [ws, setWs] = useState(null);
  const [connected, setConnected] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [status, setStatus] = useState({
    type: 'online',
    activity: 'PLAYING',
    text: '',
  });

  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  const connect = () => {
    if (!token) {
      toast({
        title: 'Error',
        description: 'Please enter your Discord token',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const wsConnection = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json');
    let interval;

    wsConnection.onopen = () => {
      console.log('Connected to Discord gateway');
      toast({
        title: 'Connected',
        description: 'Successfully connected to Discord gateway',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    };

    wsConnection.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleGatewayMessage(data, wsConnection, interval);
    };

    wsConnection.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to Discord',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    };

    wsConnection.onclose = () => {
      console.log('Disconnected from Discord gateway');
      setConnected(false);
      clearInterval(interval);
      toast({
        title: 'Disconnected',
        description: 'Disconnected from Discord gateway',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    };

    setWs(wsConnection);
  };

  const handleGatewayMessage = (data, wsConnection, interval) => {
    const { op, t, d } = data;

    switch (op) {
      case 10: // Hello
        interval = setInterval(() => {
          wsConnection.send(JSON.stringify({ op: 1, d: null }));
        }, d.heartbeat_interval);

        wsConnection.send(JSON.stringify({
          op: 2,
          d: {
            token: token,
            properties: {
              $os: 'browser',
              $browser: 'Discord Status Customizer',
              $device: 'Discord Status Customizer'
            },
            presence: {
              status: status.type,
              activities: [{
                name: status.text || 'Discord Status Customizer',
                type: status.activity
              }]
            }
          }
        }));
        break;

      case 0: // Dispatch
        if (t === 'READY') {
          setConnected(true);
          toast({
            title: 'Ready',
            description: 'Successfully authenticated with Discord',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        }
        break;

      default:
        break;
    }
  };

  const updateStatus = () => {
    if (!ws || !connected) {
      toast({
        title: 'Error',
        description: 'Not connected to Discord',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const presence = {
      op: 3,
      d: {
        since: null,
        activities: [{
          name: status.text || 'Discord Status Customizer',
          type: status.activity
        }],
        status: status.type,
        afk: false
      }
    };

    ws.send(JSON.stringify(presence));
    toast({
      title: 'Status Updated',
      description: 'Successfully updated Discord status',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const disconnect = () => {
    if (ws) {
      ws.close();
      setWs(null);
      setConnected(false);
    }
  };

  return (
    <ChakraProvider>
      <Box minH="100vh" bg={bgColor} py={10}>
        <Container maxW="container.md">
          <VStack spacing={6}>
            <Flex w="full" justify="flex-end">
              <IconButton
                icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
                onClick={toggleColorMode}
                variant="ghost"
              />
            </Flex>

            <Alert
              status="warning"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              borderRadius="md"
              mb={4}
            >
              <AlertIcon boxSize="24px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Important Notice
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                This tool is for educational purposes only. For a more reliable CLI version, visit:{' '}
                <Link
                  href="https://github.com/ToolsPeople200/always-online"
                  color="blue.500"
                  isExternal
                >
                  GitHub Repository
                </Link>
              </AlertDescription>
            </Alert>

            <Box w="full" bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
              {!connected ? (
                <VStack spacing={4}>
                  <Text fontSize="xl" fontWeight="bold">Connect to Discord</Text>
                  <Flex w="full">
                    <Input
                      type={showToken ? 'text' : 'password'}
                      placeholder="Enter your Discord token"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      mr={2}
                    />
                    <IconButton
                      icon={showToken ? <FaEyeSlash /> : <FaEye />}
                      onClick={() => setShowToken(!showToken)}
                    />
                  </Flex>
                  <Button colorScheme="blue" onClick={connect} w="full">
                    Connect
                  </Button>
                </VStack>
              ) : (
                <VStack spacing={4}>
                  <Text fontSize="xl" fontWeight="bold">Update Status</Text>
                  <Select
                    value={status.type}
                    onChange={(e) => setStatus({ ...status, type: e.target.value })}
                  >
                    <option value="online">🟢 Online</option>
                    <option value="idle">🌙 Idle</option>
                    <option value="dnd">⛔ Do Not Disturb</option>
                    <option value="invisible">⚫ Invisible</option>
                  </Select>
                  <Select
                    value={status.activity}
                    onChange={(e) => setStatus({ ...status, activity: e.target.value })}
                  >
                    <option value="PLAYING">🎮 Playing</option>
                    <option value="LISTENING">🎵 Listening to</option>
                    <option value="WATCHING">📺 Watching</option>
                    <option value="STREAMING">🎥 Streaming</option>
                    <option value="COMPETING">🏆 Competing in</option>
                  </Select>
                  <Flex w="full">
                    <Input
                      placeholder="Status text"
                      value={status.text}
                      onChange={(e) => setStatus({ ...status, text: e.target.value })}
                      mr={2}
                    />
                    <IconButton
                      icon={<FaSmile />}
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    />
                  </Flex>
                  {showEmojiPicker && (
                    <Box position="absolute" zIndex="modal">
                      <Picker
                        data={data}
                        onEmojiSelect={(emoji) => {
                          setStatus({ ...status, text: status.text + emoji.native });
                          setShowEmojiPicker(false);
                        }}
                        theme={colorMode}
                      />
                    </Box>
                  )}
                  <Button colorScheme="blue" onClick={updateStatus} w="full">
                    Update Status
                  </Button>
                  <Button colorScheme="red" onClick={disconnect} w="full">
                    Disconnect
                  </Button>
                </VStack>
              )}
            </Box>
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
