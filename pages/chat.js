import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useEffect, useState } from 'react';
import appConfig from '../config.json';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDg2OTA3MywiZXhwIjoxOTU2NDQ1MDczfQ.343ibq7UYFPDdyfsfGmEqUma01RW7P7KC9U2MDAGSkI';
const SUPABASE_URL = 'https://kysxypdmtxjlkdysdlas.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function getMessagesInRealTime(addMessage) {
  return supabaseClient
  .from('mensagens')
  .on('INSERT', (messages) => {
    addMessage(messages.new);
  })
  .subscribe();
}

export default function ChatPage() {
  const [mensagem, setMensagem] = useState('')
  const [listaMensagens, setListaMensagens] = useState([])
  const router = useRouter()
  const usuarioLogado = router.query.username

  useEffect(function(){
    supabaseClient
      .from('mensagens')
      .select('*')
      .limit(10)
      .order('id', { ascending: false })
      .then(({ data }) => {
        setListaMensagens(data)
      })
      
      getMessagesInRealTime(function(novaMensagem) {
        setListaMensagens(function(newValue) {
          return [
            novaMensagem, 
            ...newValue
          ]
        })
      })
  }, [])

  // Sua lógica vai aqui
  function handleAddMessageToList(message) {
    const mensagem = {
      de: usuarioLogado,
      texto: message
    }

    supabaseClient
      .from('mensagens')
      .insert([
        mensagem
      ])
      .then(({ data }) => {
      })

    setMensagem('')
  }
  // ./Sua lógica vai aqui
  return (
    <Box
      styleSheet={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundImage: 'url(https://i.pinimg.com/originals/37/ef/b1/37efb13aebc8d4e3e3ada903f8847410.jpg)',
        backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000']
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          height: '100%',
          maxWidth: '95vw',
          maxHeight: '95vh',
          padding: '32px',
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: 'transparent',
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px',
          }}
        >

          <MessageList mensagens={listaMensagens} mudarLista={setListaMensagens}/>
          <Box
            as="form"
            styleSheet={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <TextField
              placeholder="Insira sua mensagem aqui..."
              type="textfield"
              value={mensagem}
              onChange={function (event) {
                setMensagem(event.target.value)
              }}
              onKeyPress={function (event) {
                if (event.key === "Enter") {
                  event.preventDefault()
                  handleAddMessageToList(mensagem)
                }
              }}
              styleSheet={{
                width: '100%',
                height: '50px',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: '12px',
                color: appConfig.theme.colors.neutrals[200],
              }}
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.primary[500],
                  borderColor: appConfig.theme.colors.primary[400],
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                },
              }}
            />

            <ButtonSendSticker onStickerClick={function(sticker){
              handleAddMessageToList(`:sticker:${sticker}`)
            }}/>

            <Button
              onClick={function () {
                handleAddMessageToList(mensagem)
              }}
              iconName="arrowRight"
              size="lg"
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["999"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
              styleSheet={{
                marginLeft: '5px',
                borderRadius: '50%',
                padding: '0 3px 0 0',
                minWidth: '50px',
                minHeight: '50px',
                fontSize: '20px',
                marginBottom: '8px',
                lineHeight: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Enviar
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function Header() {
  return (
    <>
      <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
        <Text variant='heading5'>
          Chat
        </Text>
        <Button
          variant='tertiary'
          colorVariant='neutral'
          label='Logout'
          href="/"
        />
      </Box>
    </>
  )
}

function MessageList(props) {
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: 'scroll',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: '16px',
      }}
    >
      {props.mensagens.map(function (mensagem, index) {
        return (
          <Box
            as='div'
            key={index}
            styleSheet={{
              display: 'flex',
              justifyContent: 'space-betweeen'
            }}
          >
            <Text
              tag="li"
              styleSheet={{
                borderRadius: '5px',
                padding: '6px',
                marginBottom: '12px',
                width: '100%',
                border: '0',
                resize: 'none',
                hover: {
                  backgroundColor: appConfig.theme.colors.neutrals[700],
                }
              }}
            >
              <Box
                styleSheet={{
                  marginBottom: '8px',
                }}
              >
                <Image
                  alt="teste"
                  styleSheet={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'inline-block',
                    marginRight: '8px',
                  }}
                  src={`https://github.com/${mensagem.de}.png`}
                />
                <Text tag="strong">
                  {mensagem.de}
                </Text>
                <Text
                  styleSheet={{
                    fontSize: '10px',
                    marginLeft: '8px',
                    color: appConfig.theme.colors.neutrals[300],
                  }}
                  tag="span"
                >
                  {(new Date().toLocaleDateString())}
                </Text>
              </Box>
              {mensagem.texto.startsWith(':sticker:') ? 
                (
                  <Image 
                    src={mensagem.texto.replace(':sticker:', '')} alt='Sticker'
                    styleSheet={{
                      maxWidth: '300px',
                      maxHeight: '300px'
                    }}
                  /> 

                ) :
                (
                  mensagem.texto
                )   
              }
            </Text>
            <Box
              as='div'
              styleSheet={{
                borderRadius: '50%',
                padding: '0 3px 0 0',
                minWidth: '50px',
                maxHeight: '45px',
                fontSize: '15px',
                marginBottom: '8px',
                lineHeight: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '5px',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                color: appConfig.theme.colors.primary[500],
                hover: {
                  backgroundColor: appConfig.theme.colors.neutrals[700],
                }
                
              }}
              onClick={function() {
                const novaLista = props.mensagens
                novaLista.splice(index, 1)
                props.mudarLista([...novaLista])
              }}
            >x</Box>
          </Box>
        )
      })}
    </Box>
  )
}
